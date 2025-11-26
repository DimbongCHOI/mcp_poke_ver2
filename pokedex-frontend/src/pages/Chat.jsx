import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react'
import { usePokemonStore } from '../store/pokemonStore'
import { useMutation } from 'react-query'
import { chatAPI } from '../services/api'
import toast from 'react-hot-toast'

const Chat = () => {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  // Send message mutation
  const sendMessageMutation = useMutation(
    (message) => chatAPI.sendMessage(message),
    {
      onSuccess: (response) => {
        setChatHistory(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'assistant',
            content: response.message,
            timestamp: new Date()
          }
        ])
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setChatHistory(prev => [...prev, userMessage])
    setMessage('')

    try {
      await sendMessageMutation.mutateAsync(message.trim())
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const clearChat = () => {
    setChatHistory([])
    toast.success('채팅 기록이 삭제되었습니다')
  }

  const suggestedQuestions = [
    "피카츄에 대해 알려줘",
    "전기 타입 포켓몬들은 어떤 것들이 있어?",
    "가장 강한 포켓몬은 누구야?",
    "불꽃으로 시작하는 포켓몬 찾아줘",
    "포켓몬 타입 상성은 어떻게 되나요?"
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">AI 어시스턴트</h1>
          </div>
          <p className="text-gray-600 text-lg">
            포켓몬에 대해 무엇이든 물어보세요!
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-semibold">포켓몬 AI 어시스턴트</h3>
                <p className="text-purple-100 text-sm">언제든지 도와드릴게요!</p>
              </div>
            </div>
            {chatHistory.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="채팅 기록 삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">안녕하세요!</h3>
                <p className="text-gray-600 mb-6">
                  포켓몬에 대해 궁금한 것이 있으시면 언제든지 물어보세요.
                </p>
                
                {/* Suggested Questions */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-3">예시 질문:</p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(question)}
                      className="block w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                      msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === 'user' 
                          ? 'bg-blue-600' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        {msg.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`chat-bubble ${
                        msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">
                          {msg.content.split('\n').map((line, index) => {
                            // 이미지 URL 패턴 감지 (http/https로 시작하는 이미지 URL)
                            const imageUrlMatch = line.match(/(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/i);
                            if (imageUrlMatch) {
                              return (
                                <div key={index} className="my-2">
                                  <img 
                                    src={imageUrlMatch[1]} 
                                    alt="포켓몬 이미지" 
                                    className="max-w-full h-auto rounded-lg shadow-sm"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              );
                            }
                            return <p key={index}>{line}</p>;
                          })}
                        </div>
                        <p className={`text-xs mt-1 ${
                          msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {/* Loading indicator */}
            {sendMessageMutation.isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-bubble chat-bubble-assistant">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="포켓몬에 대해 질문해보세요..."
                className="flex-1 input-field"
                disabled={sendMessageMutation.isLoading}
              />
              <button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Chat
