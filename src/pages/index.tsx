import Link from 'next/link';
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

    setUserObj,
    
    handleSearch,
    handlePaginate,
    handleToggleModal,
    handleGenderFilter,
  } = useUsers()
  
  const { loader } = status
  
  const dataSource = user.userArr?.map((user: UserObj) => ({
    ...user,
    name: `${user.firstName} ${user.lastName}`,
  }));

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
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (key: string) => <span style={{textTransform: 'capitalize'}}>{key}</span>
    },
    {
			key: 'id',
			title: 'Action',
			dataIndex: 'id',
			fixed: 'right' as const,
			align: 'center' as const,
			render: (id: number) => (
				<Link href={`/users/${id}`}>
          View
        </Link>
			)
    }
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

      {/* GENDER FILTER */}
      <div className={scss.genderFilter}>
        <label htmlFor="gender-filter">Filter by Gender: </label>
        <select
          id="gender-filter"
          value={filter.filter.gender}
          onChange={handleGenderFilter}
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      {/* TABLE COMPONENT */}
      <Table
          rowKey='id'
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          scroll={{ x: 'max-content' }}
          onRow={(record: UserObj) => ({
            className: scss.clickableRow,
            onClick: (event) => {
              // Avoid opening the modal when clicking on the "View" link
              const cell = (event.target as HTMLElement).closest('td');
              if (cell?.getAttribute('data-column-key') === 'id') return;

              setUserObj(record);
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
            current={filter.currentPage}
            pageSize={filter.recordsLimit}
            onChange={handlePaginate}
          />
        : null
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