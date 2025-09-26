import React from "react";
import ChatInterface from "../components/Chat/ChatInterface";

interface ChatPageProps {
  projectId: number;
}

const ChatPage: React.FC<ChatPageProps> = ({ projectId }) => {
  return <ChatInterface projectId={projectId} />;
};

export default ChatPage;
