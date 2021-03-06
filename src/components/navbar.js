import React, { useState,useEffect } from 'react'
import styled,{css} from 'styled-components'
import Logo from '../images/logo.svg'
import User from '../images/user.svg'
import SignIn from './signin'
import Popper from './popper'
import ModalComponent from './modal'
import { useUser,useSigninCheck,useFirestore,useFirestoreDocData,useFirebaseApp } from 'reactfire'
import {doc} from '@firebase/firestore'
import Errorwrapper from './errorwrapper';
import { Link, navigate } from 'gatsby'
import ShoppingBag from '../images/bag.svg'
import HamburgerIcon from '../images/hamburger-menu.svg'
import { getMessaging, getToken, } from "firebase/messaging";
import Drawer from './drawer'
import { MenuContent } from './popper'
import { MenuContentList } from './popper'

const Navbar = styled.div`
   display: flex;
   width:100%;
   height:auto;
   padding:10px;
   box-sizing:border-box;
   z-index:10;
   
   .desktop-menu {
    display:none;
    @media only screen and (min-width: 899.1px) {
        display:flex;
        }
    }

    .logoMobile{
       
        object-fit: cover;
        @media only screen and (max-width: 899px) {  
            position: absolute;
            right: 55%;
            width:80px;
            top:5px;
            }
            
    }

   .tooltip-enter{
     opacity:0;
   }

   .tooltip-enter-active{
    opacity:1;
    transition: opacity 200ms;
  }

  .tooltip-exit{
      opacity:1;
  }
  
  .tooltip-exit-active{
    opacity:0;
    transition: opacity 200ms;
  }
`
export const Menu = styled.ul` 
  position: relative; 
  display:flex;
  flex-grow:1;
  justify-content:center;
  align-items:center;
  padding:0px;
  font-family: 'Ubuntu', sans-serif;
  margin:0px;
  ${props => props.left && css`
  justify-content:flex-end;
  `}
 
  
`

export const MenuItem = styled.li`
   position: relative;
   display:block;
   color:#35486F;
   text-align:center;
   font-family: 'Montserrat', sans-serif;
   font-size: 1.2rem;
   font-weight: 500;
   box-sizing:border-box;
   padding-left:30px;
       a{
        color:#35486F;
        box-sizing: border-box;
        width:100%;
        display:inline-block;
           text-decoration:none;
           &:hover{
            text-decoration: underline; 
           }
       }
`
export const Button = styled.button`
   position:relative;
   color: #35486F;;
   border:none;
   cursor:pointer;
   width:100px;
   padding:10px;
   margin:5px;
   box-sizing:border-box;
   border-radius:0.5rem;
   margin: 0 10px;
   font-family: 'Montserrat', sans-serif;
   text-align:center;
   &:hover{
    color: white;
    background:#13213D;
    transition: background 0.3s ease-out;
    mix-blend-mode: normal;
}

 
   ${props => props.primary && css`
   background-color:#35486F;
   color: white;
   margin:5px;
   min-width:fit-content;
   &:hover{
       color: white;
       background:#13213D;
       transition: background 0.3s ease-out;
       mix-blend-mode: normal;
   }
  `}

  ${props => props.secondary && css`
     background:rgba(224,193,175,0.5);
     text-align:center;
     display:inline-flex;
     border-radius:5px;
     width:100px;
     margin:5px;
     align-items: center;
     justify-content: center;
     min-width:fit-content;
     &:hover{
        color:#35486F;
        background-color:rgba(224,193,175,0.8);
        font-weight:bold;
        transition: background 0.3s ease-out;
    }
  `}
`

const UserWrapper = styled.div`
   width:50px;
   height:50px;
   border-radius:50%;
   background:rgba(224,193,175,0.5);
   display:flex;
   justify-content:center;
   align-items:center;
   cursor:pointer;
   transition: background 0.3s ease-out;

   &:hover{
   background:rgba(224,193,175,0.9);
   }
`
const CartNumber = styled.div`
   position:absolute;
   display:flex;
   width:30px;
   height:30px;
   top:1%;
   cursor:pointer;
  
   color:#3f3633;
   justify-content:center;
   align-items:flex-end;
   font-weight:bold;
`
const MenuIcon = styled.div`
  cursor:pointer;
  display: none;
  align-items: center;
  @media only screen and (max-width: 899px) {
    display:flex;
   }
`
export default function Nav() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const messaging = getMessaging()
    const menuItems = ['Home','Blogs','Faq','Products']
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
              .register("./firebase-messaging-sw.js")
              .then(function(registration) {
                console.log("Registration successful, scope is:", registration.scope);
                getToken(messaging, { vapidKey: 'BLfh0aam15mTS6B5Fn3p9J_9-IMZPJH7PnA6sCgNDAIalkNB84HMUYV1Nlnyy7MIjuvaOUqlmuTudwUGgU_AViE' })
                .then((currentToken) => {
                    if (currentToken) {
                    // Send the token to your server and update the UI if necessary
                    // ...
                    console.log(currentToken)
                    } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                    // ...
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    // ...
                });
                })
                .catch(function(err) {
                  console.log("Service worker registration failed, error:"  , err );
              }); 
            }
    }, [])
    
    return (
        <Navbar>
           
            <MenuIcon onClick={()=>setOpenDrawer(true)}><HamburgerIcon style={{width:40,height:40,zIndex:100}}/></MenuIcon>
            <Drawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
            <MenuContent >
                {menuItems.map(item=> 
                <MenuContentList><Link to={item==='Home'?'/':`/${item.toLowerCase()}`} >{item}</Link> </MenuContentList>
                )}
            </MenuContent>
            </Drawer>
            <div className='logoMobile'>
            <Logo  style={{width:80,height:80}}/>
            </div>
            <Menu className='desktop-menu' style={{flexGrow:10}}>
                {menuItems.map(item=> <MenuItem><Link to={item==='Home'?'/':`/${item.toLowerCase()}`} >{item}</Link> </MenuItem>)}
            </Menu>
            <Errorwrapper>
                <LoginStatus/>
            </Errorwrapper>
        </Navbar>
    )
}

function LoginStatus(){

    const [showModal, setshowModal] = useState(false)
    const [loggedIn, setloggedIn] = useState(null)
    const [showPopper, setshowPopper] = useState(false)
    const subMenuItems =['Profile','Orders','Settings']

    const { data: user } = useUser()
    const { status, data: signInCheckResult } = useSigninCheck();
    console.log(user)
    console.log(status,signInCheckResult)
    const firestore = useFirestore()
    const cartRef = user && doc(firestore, 'carts', user.uid);
    

    const CartComponent = ()=>{
        const { data:cart } = useFirestoreDocData(cartRef);
        console.log('cart',cart)
        return(
            <CartNumber>
                <Link to='/cart'>
                <small>{cart && cart.numberOfItems?cart.numberOfItems:'0'}</small>
                </Link>
           </CartNumber>
        )
    }
    return(
        <Menu left>
            <MenuItem>
            {
                user? <CartComponent/>:<CartNumber><small>0</small></CartNumber>
            }
            <ShoppingBag fill='#474E52' style={{width:30,height:30}}/>
            </MenuItem>
                { status === 'success' && 
                <>
                {
                   (signInCheckResult && signInCheckResult.signedIn === true)&&(user&&!user.isAnonymous)?
                    <Popper subMenuItems={subMenuItems}>
                        {
                            (setReferenceElement,setOpen,open)=>
                            <MenuItem  ref={setReferenceElement} tabIndex={-1} onClick={()=>setOpen(!open)}>
                            <UserWrapper><User fill='#474E52' style={{width:30,height:30}}/></UserWrapper>
                            </MenuItem>
                        }
                        
                    </Popper> 
                    :
                    <MenuItem><Button primary onClick={()=>navigate('/signin')}>Sign In</Button></MenuItem>
                }
                </>
                }  
                
                <ModalComponent showModal={showModal}>
                   <SignIn/>
                   <button onClick={()=>setshowModal(false)}>close</button>
                </ModalComponent>
            </Menu>
    )
}