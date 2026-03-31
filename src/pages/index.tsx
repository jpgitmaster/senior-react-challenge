import scss from '@/styles/Landing.module.scss';
import useUsers from '@/custom_hooks/users/useUsers';
import { Modal, Table, Spin, Pagination } from 'antd';
import { UserObj } from '@/custom_hooks/users/types/user';
import SearchComponent from '@/components/search/SearchComponent';

export default function Home() {
  const {
    user,
    filter,
    status,
    displayModal,

    setUser,
    
    handleSearch,
    handlePaginate,
    handleToggleModal
  } = useUsers()
  const { loader } = status
  
  const dataSource = user.userArr?.map((user: UserObj) => {
    return {
      ...user,
      id: user.id,
      age: user.age,
      email: user.email,
      phone: user.phone,
      lastName: user.lastName,
      firstName: user.firstName,
      name: `${user.firstName} ${user.lastName}`,
    }
  })

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  return (
    <div className={scss.app}>
      <h1>
        Users
      </h1>
      <br />

      {/* LOADER */}
      {
        loader &&
        <div className={scss.loader}>
          <Spin size='large' />
        </div>
      }

      {/* SEARCH COMPONENT */}
      <SearchComponent
        search={filter.search}
        onChange={handleSearch}
      />

      {/* TABLE COMPONENT */}
      <Table
          rowKey='id'
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          scroll={{ x: 'max-content' }}
          onRow={(record: UserObj) => ({
            onClick: () => {
              console.log(record)
              setUser(prev => ({
                ...prev,
                userObj: record
              }));
              handleToggleModal('userDetailsModal', true);
            },
          })}
      />
      <br />

      {/* PAGINATION COMPONENT */}
      {
        user.totalUsers ?
          <Pagination
            showSizeChanger={false}
            total={user.totalUsers}
            defaultPageSize={filter.recordsLimit}
            onChange={handlePaginate}
          />
        : ''
      }

      <Modal
        title="User Details"
        open={displayModal?.userDetailsModal && !!user.userObj}
        onOk={() => handleToggleModal('userDetailsModal', false)}
        onCancel={() => handleToggleModal('userDetailsModal', false)}
        footer={null}
      >
        {user.userObj && (
          <div>
            <p><strong>Name:</strong> {user.userObj.firstName} {user.userObj.lastName}</p>
            <p><strong>Age:</strong> {user.userObj.age}</p>
            <p><strong>Email:</strong> {user.userObj.email}</p>
            <p><strong>Phone:</strong> {user.userObj.phone}</p>
            <p><strong>Company Address:</strong> {`${user.userObj.company?.address?.address}, ${user.userObj.company?.address?.city}, ${user.userObj.company?.address?.state} ${user.userObj.company?.address?.postalCode}`}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}