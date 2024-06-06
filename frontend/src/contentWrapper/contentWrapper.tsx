import React, { PropsWithChildren } from 'react'



const ContentWrapper = ({children}:PropsWithChildren) => {
  return (
    <div className='wrap-content'>
        {children}
    </div>
  )
}

export default ContentWrapper