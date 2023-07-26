
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const App = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const [numberOfEmails, setNumberOfEmails] = useState('');
  const [emailJobs, setEmailJobs] = useState([]);
  const [currentEmailJob, setCurrentEmailJob] = useState();
  const [completedEmailJobs, setCompletedEmailJobs] = useState([]);
  const [userId, setUserId] = useState('1');

  useEffect(() => {
    const userIdParam = query.get('userid');
    if (userIdParam) {
      setUserId(userIdParam);
    }
  }, [query]);

  const fetchData = async (url, setStateFunc) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStateFunc(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchData(`http://localhost:3001/email/${userId}`, setEmailJobs);
    fetchData(`http://localhost:3001/email/${userId}/completed`, setCompletedEmailJobs);

    const socket = io('http://localhost:3001', {
      query: { userId },
    });
    socket.on('connect', () => {
      console.log('Socket.IO connection established.');
    });
    socket.on('emailJob_updates', (data) => {
      console.log('Received message:', data);
      setCurrentEmailJob({ ...data });
    });
    socket.on('disconnect', () => {
      console.log('Socket.IO connection closed.');
    });
 
    return () => {
      socket.close();
    };
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/email/send-emails', {
        method: 'POST',
        body: JSON.stringify({ userId, numberOfEmails: parseInt(numberOfEmails) }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCurrentEmailJob(data[0]);
      fetchData(`http://localhost:3001/email/${userId}`, setEmailJobs);
    } catch (error) {
      console.error('Error submitting email job:', error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 items-center justify-center">
      <div className="flex justify-center items-center gap-5 w-full">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white ">Current User</h1>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white ">{userId}</h1>
      </div>
      <div className='m-10 flex items-center flex-col justify-space-around'>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-center">Email Job Submission</h1>
          <form onSubmit={handleSubmit} className="flex items-center justify-center flex-wrap">
            <input
              type="number"
              placeholder="Enter the number of emails"
              className="border rounded-lg px-4 py-2 mr-2"
              value={numberOfEmails}
              onChange={(event) => setNumberOfEmails(event.target.value)}
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Send Emails
            </button>
          </form>

        </div>
        <div className="w-96 m-4 text-center flex flex-col gap-5 p-6 justify-center items-center">
        {currentEmailJob ? <h1 className="mb-2 text-4xl font-bold tracking-tight text-purple-800 ">Current</h1> : null}
          {currentEmailJob ?
            <div className="flex flex-col items-center gap-5 bg-white border border-gray-200 rounded-lg shadow  hover:bg-gray-100">
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 flex justify-between">{currentEmailJob.status}</h1>
              <div className="flex flex-col items-center gap-2 w-9/12">
                <div className="flex justify-between w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Total Emails</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{currentEmailJob.totalEmails}</h5>
                </div>
                <div className="flex justify-between w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Emails Sent</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{currentEmailJob.emailsSent}</h5>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-9/12">
                <div className="flex justify-between w-full">
                  <p className="font-normal text-gray-700 ">User Id</p>
                  <p className="font-normal text-gray-700 ">{currentEmailJob.userId}</p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="font-normal text-gray-700 ">Job Id</p>
                  <p className="font-normal text-gray-700 ">{currentEmailJob.id}</p>
                </div>
              </div>
            </div> : null}

            {emailJobs.length > 0 ? <h1 className="mb-2 text-4xl font-bold tracking-tight text-purple-800 ">Queue</h1> : null}
          {emailJobs.length > 0 ? emailJobs.map((ele, index) => (
            <div className='flex flex-col items-center  max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100' key={index}>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 flex justify-between">{ele.status}</h1>
              <div className="flex flex-col items-center gap-2 w-9/12">
                <div className="flex justify-between w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Total Emails</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{ele.totalEmails}</h5>
                </div>
                <div className="flex justify-between w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Emails Sent</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{ele.emailsSent}</h5>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-9/12">
                <div className="flex justify-between w-full">
                  <p className="font-normal text-gray-700 ">userId</p>
                  <p className="font-normal text-gray-700 ">{ele.userId}</p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="font-normal text-gray-700 ">Job Id</p>
                  <p className="font-normal text-gray-700 ">{ele.id}</p>
                </div>
              </div>
            </div>
          ))
            : null}
          
          {completedEmailJobs.length > 0 ? <h1 className="mb-2 text-4xl font-bold tracking-tight text-purple-800 ">Completed</h1> : null}
          {completedEmailJobs.length > 0 ? completedEmailJobs.map((ele, index) => (
            <div className='flex flex-col items-center  max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100' key={index}>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 flex justify-between">{ele.status}</h1>
              <div className="flex flex-col items-center gap-2 w-9/12">
                <div className="flex justify-between w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Total Emails</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{ele.totalEmails}</h5>
                </div>
                <div className="flex justify-between w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Emails Sent</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{ele.emailsSent}</h5>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-9/12">
                <div className="flex justify-between w-full">
                  <p className="font-normal text-gray-700 ">userId</p>
                  <p className="font-normal text-gray-700 ">{ele.userId}</p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="font-normal text-gray-700 ">Job Id</p>
                  <p className="font-normal text-gray-700 ">{ele.id}</p>
                </div>
              </div>
            </div>
          ))
            : null}

        </div>
      </div>
    </div>
  );
};

export default App;


