import React from 'react'
import './style.css'




const Button = ({ text, onClick, className}) => {


    return <button className={"btn " + className} type='button' onClick={onClick} >{text}</button>
}

export default Button