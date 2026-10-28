import React, { createContext } from 'react'

export const authDataContext=createContext()
function AthContext({children}) {
  const serverUrl= "https://linkedin-backend-kcwx.onrender.com"
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
