declare module 'react-simple-chatbot' {
  import * as React from 'react';

  interface Step {
    id: string;
    message?: string;
    trigger?: string;
    user?: boolean;
    component?: React.ReactNode;
  }

  interface ChatBotProps {
    headerTitle?: string;
    steps: Step[];
    placeholder?: string;
    recognitionEnable?: boolean;
    // Add any other props you use
  }

  // Change to functional component
  const ChatBot: React.FC<ChatBotProps>;

  export default ChatBot;
}

declare module 'styled-components' {
  import { ThemedStyledComponentsModule } from 'styled-components';

  export interface DefaultTheme {
    // Define your theme properties here
    background?: string;
    fontFamily?: string;
    headerBgColor?: string;
    headerFontColor?: string;
    headerFontSize?: string;
    botBubbleColor?: string;
    botFontColor?: string;
    userBubbleColor?: string;
    userFontColor?: string;
  }

  const styled: ThemedStyledComponentsModule<DefaultTheme>;

  export default styled;
}
