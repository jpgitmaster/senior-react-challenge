import Axios from "axios";
import { User } from "./types/user";
import { useDebounce } from "@/components/search/useDebounce";
import { initUser, initFilter, initStatus } from "./states/user";
import { useState, useEffect, useCallback, ChangeEvent } from "react";

const useUsers = () => {
    const [filter, setFilter] = useState(initFilter);
    const [status, setStatus] = useState(initStatus);
    const [user, setUser] = useState<User>(initUser);
    const debouncedSearch = useDebounce(filter.search, 400); // 400ms debounce
    const [displayModal, setDisplayModal] = useState({
        userDetailsModal: false,
    });

    // API CALLS
    const getUsers = useCallback(async (page?: number, searchValue?: string) => {
        setStatus({
            ...status,
            loader: true
        })
        try {
            const currentPage = page ?? filter.currentPage
            const skip = (currentPage - 1) * filter.recordsLimit
            const endpoint = searchValue
                    ? `/users/search?q=${encodeURIComponent(searchValue)}&limit=${filter.recordsLimit}&skip=${skip}`
                    : `/users?limit=${filter.recordsLimit}&skip=${skip}`;

            const res = await Axios.get(endpoint)
            const { users, total } = res.data

            if(users?.length){
                setUser(prev => ({
                    ...prev,
                    totalUsers: total,
                    userArr: res.data.users || [],
                }))
            }else{
                setUser(prev => ({
                    ...prev,
                    totalUsers: 0,
                    userArr: []
                }))
            }

        } catch (error) {
            console.error(error)
        } finally {
            setStatus({
                ...status,
                loader: false
            })
        }
    }, [])

    const handleToggleModal = (modalName: string, display: boolean) => {
        setDisplayModal(prev => ({
            ...prev,
            [modalName]: display,
        }));
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFilter({
            ...filter,
            search: value,
            currentPage: 1, // reset page when searching
        })
    }

    const handlePaginate = async (current: number) => {
        setFilter({
            ...filter,
            currentPage: current
        })
        
        return await getUsers(current)
    }

    useEffect(() => {
        getUsers(filter.currentPage, debouncedSearch);
    }, [getUsers, debouncedSearch, filter.currentPage]);

    return {
        // STATES
        user,
        filter,
        status,
        displayModal,

        // SET STATES
        setUser,

        // HANDLES
        handleSearch,
        handlePaginate,
        handleToggleModal
    }
}

export default useUsers;