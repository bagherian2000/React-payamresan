import React from 'react';

const RunningProjects = () => {
  const runningProjects = [
    {
      id: 1,
      status: 'Running',
      totalSuccess: 150,
      curSuccess: 25,
      curAnswerTels: 30,
      curTotalSended: 100,
      curTotalTels: 200,
      strCurSendingNo: '50',
      priority: 'High',
      telFileName: 'tel_file_1.csv',
      projectedId: 'PRJ001'
    }
  ];

  return (
    <div className="table-container">
      <h3>نمایش اطلاعات پروژه های در حال اجرا</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Total Success</th>
            <th>Current Success</th>
            <th>Current Answer Tels</th>
            <th>Current Total Sended</th>
            <th>Current Total Tels</th>
            <th>Current Sending No</th>
            <th>Priority</th>
            <th>Tel File Name</th>
            <th>Project ID</th>
          </tr>
        </thead>
        <tbody>
          {runningProjects.map(project => (
            <tr key={project.id}>
              <td>{project.status}</td>
              <td>{project.totalSuccess}</td>
              <td>{project.curSuccess}</td>
              <td>{project.curAnswerTels}</td>
              <td>{project.curTotalSended}</td>
              <td>{project.curTotalTels}</td>
              <td>{project.strCurSendingNo}</td>
              <td>{project.priority}</td>
              <td>{project.telFileName}</td>
              <td>{project.projectedId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RunningProjects;