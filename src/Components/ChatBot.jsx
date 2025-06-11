import React, { useContext, useState, useEffect, useRef } from "react"
import { ReactComponent as ChatIcon } from '../Resources/Icons/chat.svg'
// import { ReactComponent as ExpandIcon } from '../Resources/Icons/fullscreen.svg'
// import { ReactComponent as CollapseIcon } from '../Resources/Icons/fullscreen_exit.svg'
// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { PreduContext } from "../PreduContext";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { api_path, chatHistory, addChatMessage } = useContext(PreduContext);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const toggleState = () => {
    setOpen(prev => !prev);
  };

  // Добавляем обработчик клика вне чата для закрытия
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target) && 
          !event.target.closest('.chat-button')) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const simulateTyping = async (message, delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    return message;
  };

  const handleSend = async(text) => {
    if (!text.trim()) return;

    const newChatUser = {
      message: text,
      sender: "Пользователь",
      direction: "outgoing"
    };
    
    addChatMessage(newChatUser);
    const newChatHistory = [...chatHistory, newChatUser];

    try {
      // Первый слой чат-бота
      const chat_api_1 = api_path + "/api/chatbot/layer-1";
      const chatSend = {
        text: text,
        chat_history: newChatHistory
      };

      // Показываем индикатор печатания
      setIsTyping(true);
      
      const chatResponse = await axios.post(chat_api_1, chatSend);
      
      // Симулируем печатание перед ответом
      await simulateTyping(chatResponse.data.response);
      
      const newChatBot = {
        message: chatResponse.data.response,
        sender: "Чат-бот PreDu",
        direction: "incoming"
      };
      addChatMessage(newChatBot);

      // Второй слой чат-бота (если нужно)
      if (chatResponse.data.can_query === "True") {
        const chat_api_2 = api_path + "/api/chatbot/layer-2";
        
        // Показываем индикатор печатания для второго ответа
        setIsTyping(true);
        
        const chatResponse2 = await axios.post(chat_api_2, chatSend);
        
        // Симулируем печатание перед вторым ответом
        await simulateTyping(chatResponse2.data);
        
        const newChatBot2 = {
          message: chatResponse2.data,
          sender: "Чат-бот PreDu",
          direction: "incoming"
        };
        addChatMessage(newChatBot2);
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      const errorMessage = {
        message: "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
        sender: "Чат-бот PreDu",
        direction: "incoming"
      };
      addChatMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="chat-bot">
        <div 
          ref={chatContainerRef}
          className={`container${isOpen ? " open" : ""}`}
        >
          <MainContainer className="main-container">
            <ChatContainer className="chat-container">
              <MessageList className="message-list">
                {chatHistory.map((chat, index) => (
                  <Message 
                    key={`${chat.message}-${index}`}
                    model={{
                      message: chat.message,
                      sender: chat.sender,
                      direction: chat.direction
                    }}
                  >
                    <Message.Header sender={chat.sender}/>
                  </Message>
                ))}
                {isTyping && (
                  <Message
                    model={{
                      message: "Печатает",
                      sender: "Чат-бот PreDu",
                      direction: "incoming"
                    }}
                    className="typing"
                  >
                    <Message.Header sender="Чат-бот PreDu"/>
                  </Message>
                )}
                <div ref={messagesEndRef} />
              </MessageList>
              <MessageInput 
                className="message-input" 
                attachButton={false} 
                placeholder="Введите сообщение здесь" 
                onSend={handleSend}
                disabled={isTyping}
              />
            </ChatContainer>
          </MainContainer>
        </div>
        <button 
          className="chat-button" 
          onClick={toggleState}
          aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
        >
          <ChatIcon className="icon"/>
        </button>
      </div>
    </>
  );
};

export default ChatBot;