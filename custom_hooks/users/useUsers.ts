import Axios from "axios";
import { User } from "./types/user";
import { useState, ChangeEvent } from "react";
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from "@/components/search/useDebounce";
import { initUser, initFilter, initStatus } from "./states/user";

const fetchUsers = async (page: number, search: string, limit: number) => {
  const skip = (page - 1) * limit;
  const endpoint = search
    ? `/users/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    : `/users?limit=${limit}&skip=${skip}`;

  const res = await Axios.get(endpoint);
  return res.data;
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
        queryKey: ['users', filter.currentPage, debouncedSearch, filter.recordsLimit],
        queryFn: () => fetchUsers(filter.currentPage, debouncedSearch, filter.recordsLimit),
        placeholderData: (prev) => prev, // replaces keepPreviousData
    });

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
        filter,
        status: {
            loader: isLoading || isFetching
        },
        displayModal,

        // SET STATES
        setUserObj,

        // HANDLES
        handleSearch,
        handlePaginate,
        handleToggleModal
    }
}

export default useUsers;