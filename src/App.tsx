import { useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import './App.css';

function App() {
  interface Result {
    node_name: string;
    dataset_uuid: number;
    dataset_name: string;
    dataset_portal_url: string;
    dataset_total_subjects: number;
    records_protected: boolean;
    num_matching_subjects: number;
    subject_data: object;
    image_modals: [];
  }

  const [result, setResult] = useState<Result[]>([])

  function apiQueryURL() {
    const url: string = import.meta.env.VITE_API_QUERY_URL;
    return url.endsWith('/') ? `${url}query/?` : `${url}/query/?`;
  }

  async function submitQuery() {
    const url: string = `${apiQueryURL()}healthy_control=true`;
    try {
      const response = await axios.get(url);
      setResult(response.data);
    } catch (error) {
      console.log(error);
    }
    
    
  }

  return (
    <>
        <Button variant="contained" endIcon={<SendIcon />} onClick={() => submitQuery()}>
          Submit Query
        </Button>
        <ul>
          {result.map((item) => <li key={item.dataset_uuid}>{item.dataset_name}</li>)}
        </ul>
    </>
  );
}

export default App;
