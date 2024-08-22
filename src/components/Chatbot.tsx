import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { FaRobot } from 'react-icons/fa';
import Draggable from 'react-draggable';
import { QueryResponse } from '../utils/types';

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Roboto, sans-serif',
  headerBgColor: '#4169E1',
  headerFontColor: '#fff',
  headerFontSize: '100%',
  botBubbleColor: '#4169E1',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

interface Steps {
  waiting2?: {
    value: string;
  };
}

interface FetchAnswerProps {
  steps: Steps;
  triggerNextStep: (step: { trigger: string }) => void;
  setResult: (result: QueryResponse | null) => void;
}

function FetchAnswer({ steps, triggerNextStep, setResult }: FetchAnswerProps) {
  const [answer, setAnswer] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const userQuery = steps.waiting2?.value;

    if (userQuery && !isFetching && !answer && !errorMessage) {
      const fetchAnswerFromModel = async (question: string) => {
        setIsFetching(true);
        try {
          const response = await axios.post('http://localhost:8080/generate_url/', {
            query: question,
          });

          const { data } = response;

          if (response.status === 200) {
            const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
            if (urlPattern.test(data.response)) {
              const urlResponse = await axios.get(data.response);
              setAnswer('Query successful.');
              setResult(urlResponse.data);
            } else {
              setAnswer(data.response);
              setResult(null);
            }
            triggerNextStep({ trigger: 'waiting2' });
          } else {
            setErrorMessage(data.detail || 'An error occurred.');
          }
        } catch {
          setErrorMessage('An error occurred while fetching the answer.');
        } finally {
          setIsFetching(false);
        }
      };

      fetchAnswerFromModel(userQuery);
    }
  }, [steps.waiting2?.value, answer, errorMessage, isFetching, setResult, triggerNextStep]);

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p>Error: {errorMessage}</p>;
  }

  return <p>{answer}</p>;
}

interface ChatbotFeatureProps {
  setResult: (result: QueryResponse | null) => void;
}

function ChatbotFeature({ setResult }: ChatbotFeatureProps) {
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  const steps = [
    {
      id: 'Welcome',
      message: 'Hello, welcome to Neurobagel! Please enter your query.',
      trigger: 'waiting2',
    },
    {
      id: 'waiting2',
      user: true,
      trigger: 'FetchAnswer',
    },
    {
      id: 'FetchAnswer',
      component: <FetchAnswer setResult={setResult} triggerNextStep={() => {}} steps={{}} />,
      asMessage: true,
    },
  ];

  return (
    <div className="fixed bottom-5 right-9 z-40 flex flex-col items-end">
      <button
        type="button"
        aria-label="Toggle chatbot"
        className="relative mb-4 rounded-full border-none bg-blue-500 p-3 text-white outline-none hover:bg-blue-600 focus:outline-none"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        <FaRobot className="text-2xl" />
        <span className="absolute right-8 top-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
      </button>
      {showChatbot && (
        <Draggable>
          <div className="fixed bottom-12 right-32 z-50 w-80 rounded-lg border border-gray-300 bg-white shadow-lg">
            <ThemeProvider theme={theme}>
              <ChatBot
                headerTitle="Neurobagel Chat"
                steps={steps}
                placeholder="Enter your query"
                recognitionEnable
              />
            </ThemeProvider>
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default ChatbotFeature;
