import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../blocks/header/header.css'


function Header({ email, isLoggedIn, handleSignOut }) {
    const location = useLocation();
    // const [bg, setBg] = React.useState(`url('./burger.svg')`)
    const [isDisplayed, setIsDisplayed] = React.useState('none')
    const [open, setOpen] = React.useState('open');

    const [getWidth, setGetWidth] = React.useState(window.innerWidth);

    const updateDimensions = () => {
        setGetWidth(window.innerWidth);
    }

    React.useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [getWidth])


    const handleLoggedInButton = () => {
        return <button onClick={handleSignOut} className='header__signout'>Sign Out</button>
    }

    const handleLoggedOutButton = () => {
        if (location.pathname === '/signin') {
            return <a href='./signup' className='header__link'>Sign up</a>
        } else {
            return <a href='./signin' className='header__link'>Sign in</a>
        }
    }

    const handleBurger = () => {
        setIsDisplayed(isDisplayed === 'none' ? 'flex' : 'none');
        setOpen(open === 'open' ? 'close' : 'open')
        // setBg(bg === `url('./burger.svg')` ? `url('./CloseIcon.svg')` : `url('./burger.svg')`)
    }


    return (
        <header className="header">
            <div className="header__logo" />
            {isLoggedIn && getWidth > 651 ?
                <>
                    <div className='header__loggedin'>
                        <p className='header__email' >
                            {email}
                        </p>
                        {handleLoggedInButton()}
                    </div>
                </>
                :
                <>
                </>
            }

            {isLoggedIn && getWidth < 652 ?
                <>
                    <button className='header__burger' onClick={handleBurger}>
                        <span className={`header__burger_${open}`}></span>
                        <span className={`header__burger_${open}`}></span>
                        <span className={`header__burger_${open}`}></span>
                    </button>
                    <div className='header__loggedin' style={{
                        display: `${isDisplayed}`,
                        width: '100%',
                        flexDirection: ' column',
                        position: 'relative',
                        alignContent: 'center',
                        justifyContent: 'center',
                        margin: '0',
                        textAlign: 'center',
                        top: '0',
                        left: '0',
                        borderBottom: '1px solid rgba(84, 84, 84, 0.7)'
                    }}>
                        <p className='header__email' >
                            {email}
                        </p>
                        {handleLoggedInButton()}
                    </div>
                </>
                :
                <>
                </>
            }

            {!isLoggedIn
                &&
                <div className='header__loggedout'>
                    {handleLoggedOutButton()}
                </div>}


            {/* <button className='header__burger' style={{backgroundImage: `${bg}`}}  onClick={handleBurger}>
            </button> */}

        </header>

    )
}


export default Header;