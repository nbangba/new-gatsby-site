import React from 'react'
import Layout from '../components/layout'
import UserProfile from '../components/userprofile'
import { getAnalytics, logEvent } from "firebase/analytics";
export default function User() {
    const analytics = getAnalytics();
    return ( 
        <Layout>
           <UserProfile/>
        </Layout>    
    )
}
