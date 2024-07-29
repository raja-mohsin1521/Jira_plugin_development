import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Button, Spinner, Text } from '@forge/react';
import { invoke } from '@forge/bridge';

import { DynamicTable } from "@forge/react";


const App = () => {
const [seeProjects,setSeeProjects]=useState(false)
const [seeIssues,setSeeIssues]=useState(false)
const [loading,setLoading]=useState(true)
function ToggleProject(){
  setSeeProjects(!seeProjects)
  setSeeIssues(false)
}
function ToggleIssues(){
  setSeeProjects(false)
  setSeeIssues(!seeIssues)
}


 const [project,setProject]=useState([])
 const [projectlength,setprojectlength]=useState(0)
 const [issues,setissues]=useState([])
 const [issueslength,setissueslength]=useState(0)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Project Function Calledaaaaaaaaaaaaa')
        const projects = await invoke('getProjects');
        const formattedData = Object.values(projects.data);
        setprojectlength(projects.data.length)
        console.log(formattedData)
       setProject(formattedData)
      }
      catch (error) {
        console.error('Error fetching data:', error);
       
      }
    };
    const fetchIssues = async () => {
      try {
        console.log('Issue Function Called')
        const issue = await invoke('getIssue');
        const formattedData = Object.values(issue.data);

        setissueslength(formattedData.length)
        setissues(formattedData)
        console.log(formattedData)
        setLoading(false)
      }
      catch (error) {
        console.error('Error fetching data:', error);
       
      }
    };
  
  
  
    fetchProjects();
    fetchIssues();
    
  }, []);



  const getProjectRows = () => {
    console.log(project, "filteredData");
    return project?.map((data, index) => ({
      key: `row-${index}`,
      cells: [
        { content: <Text>{data.id} </Text> },
        { content: <Text>{data.key} </Text> },
        { content: <Text>{data.project} </Text> },
        { content: <Text>{data.type} </Text> },
      
      ],
      isHighlighted: data.timeSpent < 37.5
    }));
  };

  const getIssueRows = () => {
    console.log(issues, "filteredData");
    return issues?.map((data, index) => ({
      key: `row-${index}`,
      cells: [
        { content: <Text>{data.key} </Text> },
        { content: <Text>{data.summary} </Text> },
        { content: <Text>{data.project} </Text> },
        { content: <Text>{data.status} </Text> },
      
      ],
      isHighlighted: data.timeSpent < 37.5
    }));
  };


  const ProjectTh = {
    cells: [
      {
        key: 'number',
        content: 'id',
        isSortable: true,
      },
      {
        key: 'string',
        content: 'Key',
        isSortable: true,
      },
      {
        key: 'string',
        content: 'Name',
        isSortable: true,
      },
      {
        key: 'string',
        content: 'Type',
        isSortable: true,
      },
    ],
  };
  
  
  const IssueTh = {
    cells: [
      {
        key: 'number',
        content: 'id',
        isSortable: true,
      },
      {
        key: 'string',
        content: 'Issue',
        isSortable: true,
      },
      {
        key: 'string',
        content: 'Project',
        isSortable: true,
      },
      {
        key: 'string',
        content: 'Status',
        isSortable: true,
      },
    ],
  };
  

	return (
    <>
    {!loading?
    <> <Text>Total Projects : {projectlength}</Text>
    <Button onClick={ToggleProject}>{!seeProjects?'Show':'Hide'}</Button>
    {seeProjects?	<DynamicTable
          head={ProjectTh}
          rows={getProjectRows()}
          rowsPerPage={4}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
        />:<></>}
     <Text>Total Issues : {issueslength}</Text>
     <Button onClick={ToggleIssues} >{!seeIssues?'Show':'Hide'}</Button>
      
    
    
    
    {seeIssues?	<DynamicTable
          head={IssueTh}
          rows={getIssueRows()}
          rowsPerPage={4}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
        />:<></>}
    </>:<Spinner></Spinner>
  
  }

       </>
	);

};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
