import React from 'react';

const CompletedProjects = () => {
  const completedProjects = [
    {
      id: 1,
      avainternalWave: '4.4%',
      totalSuccess: 15967,
      totalTellnMainFile: 'ارسال و گزارش تکمیل گردید',
      status: 'Completed',
      endSendTime: 'PM 12:24:20',
      endSendDate: '1404/06/29',
      startSendTime: 'AM 10:04:22',
      startSet: '1404/0'
    },
    {
      id: 2,
      avainternalWave: '8.5%',
      totalSuccess: 10020,
      totalTellnMainFile: 'ارسال و گزارش تکمیل گردید',
      status: 'Completed',
      endSendTime: 'AM 10:15:47',
      endSendDate: '1404/06/29',
      startSendTime: 'AM 9:13:16',
      startSet: '1404/0'
    },
    {
      id: 3,
      avainternalWave: '19.4%',
      totalSuccess: 3311,
      totalTellnMainFile: 'ارسال و گزارش تکمیل گردید',
      status: 'Completed',
      endSendTime: 'AM 9:06:30',
      endSendDate: '1404/06/29',
      startSendTime: 'AM 8:51:40',
      startSet: '1404/0'
    }
  ];

  return (
    <div className="table-container">
      <h3>نمایش اطلاعات پروژه های انجام شده</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Average Internal Wave</th>
            <th>Total Success</th>
            <th>Total Tel in Main File</th>
            <th>Status</th>
            <th>End Send Time</th>
            <th>End Send Date</th>
            <th>Start Send Time</th>
            <th>Start Set</th>
          </tr>
        </thead>
        <tbody>
          {completedProjects.map(project => (
            <tr key={project.id}>
              <td>{project.avainternalWave}</td>
              <td>{project.totalSuccess}</td>
              <td>{project.totalTellnMainFile}</td>
              <td>{project.status}</td>
              <td>{project.endSendTime}</td>
              <td>{project.endSendDate}</td>
              <td>{project.startSendTime}</td>
              <td>{project.startSet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedProjects;