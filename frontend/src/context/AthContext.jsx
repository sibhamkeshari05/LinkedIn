import React, { createContext } from 'react'

export const authDataContext=createContext()
function AthContext({children}) {

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  
  let value ={
    serverUrl
  }
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  )
}

export default AthContext
