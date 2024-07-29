import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('getIssue', async ({ context }) => {
  let employeeData = [];

  try {

    const response = await api.asUser().requestJira(route`/rest/api/3/search?jql=${''}&expand=changelog`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    let data = await response.json();
    console.log(data);
    
    
    employeeData = data.issues.map((issue) => ({
      key: issue.id,
      summary: issue.fields.summary,
      
      project: issue.fields.project.name,
      status:issue.fields.status.name,
      created:issue.fields.created
    }));

  } catch (error) {
    console.error('Error fetching issue data:', error);
    return { status: 'error', message: error.message }; 
  }
  return { status: 'success', data: employeeData };
});

resolver.define('getProjects', async ({ context }) => {
  let employeeData = []; // Use let for variables that will be reassigned
  const response = await api.asUser().requestJira(route`/rest/api/3/project`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  let res = await response.json();
  employeeData = res.map((data) => ({
    id: data.id,
    key: data.key,
    project: data.name,
    type: data.projectTypeKey
  }));

  return { status: 'Got the Data', data: employeeData };
});



export const handler = resolver.getDefinitions(); 
