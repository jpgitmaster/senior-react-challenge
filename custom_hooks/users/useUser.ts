import Axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from '@tanstack/react-query';


const fetchUserById = async (userId: number | null) => {
  if (!userId) return null;
  const res = await Axios.get(`/users/${userId}`); // Axios converts number automatically
  return res.data;
};
const useUsers = () => {

    // STATES
    const router = useRouter();
    const { userID } = router.query;


    // API CALLS
    const {
        data: user,
        isLoading: loader,
    } = useQuery({
        queryKey: ['user', Number(userID)], // use userObj.id if available
        queryFn: () => fetchUserById(Number(userID)), // Convert to number if userID is string
        enabled: !!userID,
        retry: 1,
    });

    return {
        // STATES
        user,
        loader,

        // SET STATES

        // HANDLES
    }
}

export default useUsers;