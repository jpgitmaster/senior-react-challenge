import Axios from "axios";
import { User, UserObj } from "./types/user";
import { useState, ChangeEvent } from "react";
import { useQuery } from '@tanstack/react-query';
import { initUser, initFilter } from "./states/user";
import { useDebounce } from "@/components/search/useDebounce";

const fetchUsers = async (
  page: number,
  search: string,
  limit: number,
  gender?: string
) => {
  // Fetch a large dataset and filter/paginate client-side due to API limitations
  const res = await Axios.get(`/users?limit=1000`);

  let users: UserObj[] = res.data.users;

  // Fullname search (supports Firstname + Lastname)
  if (search) {
    const parts = search.toLowerCase().trim().split(" ");

    users = users.filter((user) => {
      const first = user.firstName.toLowerCase();
      const last = user.lastName.toLowerCase();

      return parts.every(
        (part) => first.includes(part) || last.includes(part)
      );
    });
  }

  // Gender filter
  if (gender) {
    users = users.filter((user) => user.gender === gender);
  }

  // Manual pagination
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedUsers = users.slice(start, end);

  return {
    users: paginatedUsers,
    total: users.length, // total BEFORE slicing
  };
};

const useUsers = () => {

    // STATES
    const [filter, setFilter] = useState(initFilter);
    const debouncedSearch = useDebounce(filter.search, 400); // 400ms debounce
    const [userObj, setUserObj] = useState<User['userObj']>(initUser.userObj);
    const [displayModal, setDisplayModal] = useState({
        userDetailsModal: false,
    });


    // API CALLS
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['users', filter.currentPage, debouncedSearch, filter.recordsLimit, filter.filter.gender],
        queryFn: () => fetchUsers(filter.currentPage, debouncedSearch, filter.recordsLimit, filter.filter.gender),
        placeholderData: (prev) => prev,
        retry: 1,
    });

    // HANDLES
    const handleToggleModal = (modalName: string, display: boolean) => {
        setDisplayModal(prev => ({
            ...prev,
            [modalName]: display,
        }));
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFilter(prev => ({
            ...prev,
            search: value,
            currentPage: 1,
        }));
    }

    const handleGenderFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        setFilter(prev => ({
            ...prev,
            filter: { ...prev.filter, gender: value },
            currentPage: 1
        }));
    };
    
    const handlePaginate = (current: number) => {
        setFilter(prev => ({
            ...prev,
            currentPage: current,
        }));
    }

    return {
        // STATES
        user: {
            userArr: data?.users || [],
            totalUsers: data?.total || 0,
            userObj,
        },
        status: {
            loader: isLoading || isFetching
        },
        filter,
        displayModal,

        // SET STATES
        setUserObj,

        // HANDLES
        handleSearch,
        handlePaginate,
        handleToggleModal,
        handleGenderFilter,
    }
}

export default useUsers;