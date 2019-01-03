import { connect } from 'dva';
import { Table, Pagination, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import UserModal from './UserModal';

import { PAGE_SIZE } from '../constants';

function Users({ dispatch, list: dataSource, total, loading, page: current }) {
  function deleteHandler(id) {
    dispatch({
      type: 'users/remove',
      payload: id
    })
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/users',
      query: { page }
    }));
  }

  function editHandler(id, values) {
    dispatch({
      type: 'users/patch',
      payload: { id, values}
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="">{text}</a>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website'
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <UserModal record={record} onOk={editHandler.bind(null, record.id)}>
            <a>Edit</a>
          </UserModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
      )
    }
  ]

  return (
    <div className={ styles.normal }>
      <div>
        <Table loading={loading} columns={columns} dataSource={dataSource} rowKey={record => record.id} pagination={false}></Table>
        <Pagination className="ant-table-pagination" total={total} current={current} pageSize={PAGE_SIZE} onChange={pageChangeHandler}></Pagination>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, total, page } = state.users;

  return {
    list,
    total,
    page,
    loading: state.loading.models.users,
  }
}

export default connect(mapStateToProps)(Users);
