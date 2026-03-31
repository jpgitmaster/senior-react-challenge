import { Spin } from 'antd';
import Link from 'next/link';
import scss from '@/styles/Landing.module.scss';
import useUser from "@/custom_hooks/users/useUser";

const UserDetails = () => {
    const {
        user,
        loader
    } = useUser()
    
    if (!user) return;
    return (
        <div className={scss.app}>
            {
                loader &&
                <div className={scss.loader}>
                    <Spin size='large' />
                </div>
            }
            <Link
                href='/'
                className={scss.backButton}
            >
                ← Back
            </Link>
            <div className={scss.userCard}>
                <h1 className={scss.userName}>
                    {user.firstName} {user.lastName}
                </h1>
                
                <div className={scss.userInfo}>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>
        </div>
    )
}
export default UserDetails;