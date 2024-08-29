import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import '../styles/Auth.css'

const cookies = new Cookies() 

const initialState = {
    fullName: '',
    username: '',
    password: '',
    repeatPassword: '',
    avatarURL: '',
}

const Auth = () => {
    const [signingUp, setSigningUp] = useState(true)
    const [form, setForm] = useState(initialState)
    const [error, setError] = useState(null)

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value }) // e.target.name je ime vnosnega polja, ki ga spreminjamo; [] ker je to object key name
    }

    const handleSubmit = async (event) => {
        event.preventDefault() // preprečimo osveževanje strani

        const { username, password, avatarURL } = form
        const URL = "https://frichat.onrender.com/" + 'auth/'
        try {
            const { data: { token, userID, hashedPassword, fullName }} = await axios.post(
                `${URL}${signingUp ? 'signup' : 'login'}`, 
                { username, password, fullName: form.fullName, avatarURL }
            )

            cookies.set('token', token)
            cookies.set('username', username)
            cookies.set('fullName', fullName)
            cookies.set('userID', userID)

            if (signingUp) {
                cookies.set('avatarURL', avatarURL)
                cookies.set('hashedPassword', hashedPassword)
            }

            window.location.reload() // ponovno naložimo stran in aplikacijo, vendar sedaj z zapolnjenim žetonom
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const setMode = (bool_value) => {
        setSigningUp(bool_value) // alternativno, če bi funkcija delovala kot stikalo: (previousSigningUp) => !previousSigningUp
        setError(null)
    }

  return (
    <div className='auth-background'>
        <div className='auth-heading'>
            <p>FRIChat</p>
        </div>
        <div className='auth-form-container'>
            <div className='auth-form'>
                <div className='auth-tab-container'>
                    <div className={signingUp ? 'auth-tab auth-tab-selected' : 'auth-tab'} onClick={() => setMode(true)}>
                        <div className='auth-tab-text-container'>
                            Registracija
                        </div>
                    </div>
                    <div className={signingUp ? 'auth-tab' : 'auth-tab auth-tab-selected'} onClick={() => setMode(false)}>
                        <div className='auth-tab-text-container'>
                            Prijava
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {signingUp && (
                        <div className='auth-form-field'>
                            <label htmlFor="fullName">Ime (in priimek)</label>
                            <input name="fullName" type="text" placeholder='Ime (in priimek)' onChange={handleChange} required/>
                        </div>
                    )}
                    <div className='auth-form-field'>
                        <label htmlFor="username">Uporabniško ime</label>
                        <input name="username" type="text" placeholder='Uporabniško ime' onChange={handleChange} required/>
                    </div>
                    {signingUp && (
                        <div className='auth-form-field'>
                            <label htmlFor="avatarURL">Avatar URL</label>
                            <input name="avatarURL" type="text" placeholder='Avatar URL' onChange={handleChange}/>
                        </div>
                    )}
                    <div className='auth-form-field'>
                        <label htmlFor="password">Geslo</label>
                        <input name="password" type="password" placeholder='Geslo' onChange={handleChange} required/>
                    </div>
                    {signingUp && (
                        <div className='auth-form-field'>
                            <label htmlFor="repeatPassword">Ponovi geslo</label>
                            <input name="repeatPassword" type="password" placeholder='Ponovi geslo' onChange={handleChange} required/>
                        </div>
                    )}
                    <p className='auth-form-error-message'>{error}</p>
                    <div className='auth-form-button'>
                        <button>{ signingUp ? "Ustvari račun" : "Prijava" }</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
export default Auth