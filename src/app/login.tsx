
import React from "react";
import { signIn, signOut, useSession, getCsrfToken } from "next-auth/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FcGoogle } from 'react-icons/fc';
import { toast } from "react-toastify";
import { MixpanelTracking } from "../../lib/analytics/mixpanel";
import UserStore from "../../store/userStore";
import Cookies from 'js-cookie'
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (session) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }
    return {
        props: { session }
    }
}

const Login = ({ session }: any) => {
    const router = useRouter();
    const { anonymousID } = UserStore();
    const { affiliate } = router.query;
    const [affiliateId, setAffiliateId] = useState(null);

    useEffect(() => {
        if (affiliate) {
            console.log('Affiliate', affiliate);
            setAffiliateId(affiliate);
            Cookies.set('affiliate', affiliate);

        }
    }, [affiliate]);

    useEffect(() => {
        // console.log('Session', session);
        if (session) {
            router.push('/dashboard')
        }

    }, [session])
    function isEmbeddedWebView() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Detection logic for different platforms
        return /Instagram/.test(userAgent) || /FBAN/.test(userAgent) || /FBAV/.test(userAgent);
    }

    const handleGoogleSignIn = async () => {

        try {
            if (isEmbeddedWebView()) {
                toast.error('Please open this page in a different browser. Google does not support this browser');
                MixpanelTracking.getInstance().track('Google Sign In Error: User tried login from embedded webview', { distinct_id: anonymousID, source: 'login_page', description: 'User tried login from embedded webview' });
                return;
            }


            await signIn("google", { callbackUrl: "/dashboard", affiliateId: affiliateId });
            MixpanelTracking.getInstance().track('Google Sign In', { distinct_id: anonymousID, source: 'login_page' });
            console.log('User logged in');
        } catch (error) {
            console.log('Error logging in', error);
            // alert('Error logging in');
        }
    }


    return (
        <div className="relative bg-main  text-white h-screen flex justify-between items-center">
            <div className=" w-full md:w-1/2 h-full blur-lg  md:blur-none">
                <img src="https://ik.imagekit.io/ei5bqbiry/Landing%20Page/Generations/login.png?updatedAt=1711541632426" className="w-full h-full object-cover" />
            </div>
            <div className=" absolute md:relative w-full md:w-1/2 bg-main/80 ">
                <div className='md:p-12 md:mx-auto  h-[100vh] flex flex-col justify-center items-center'>
                    <div className='text-center'>
                        <h1 className='text-3xl lg:text-4xl xl:text-5xl 2xl:text-[4rem] text-white font-bold font-inter  md:mt-1 mt-8 mb-4 md:mb-12 pb-1'>
                            Welcome to Unstudio{' '}
                        </h1>
                    </div>
                    <div className='text-center pt-1 mb-12 pb-1 flex flex-col items-center gap-2  '>
                        {!session && (
                            <button
                                type='button'
                                onClick={handleGoogleSignIn}
                                className='flex justify-center w-full  items-center gap-8 hover:text-white bg-primary-green px-8 py-2.5 text-base font-semibold font-inter duration-200 transition rounded-md  hover:border-transparent hover:shadow-lg cursor-pointer border border-black border-opacity-30 focus:outline-none focus:ring-0 active:shadow-lg ease-in-out  '
                            >
                                <FcGoogle fontSize={'20'} />
                                <span>Continue with Google</span>
                            </button>
                        )}
                    </div>
                    <p className='fixed font-bold font-inter text-base lg:text-[1rem] text-white  2xl:text-[1.4rem] bottom-5 lg:bottom-8 right-4 lg:right-6'>
                        Unstudio.ai
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Login;
