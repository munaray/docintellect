import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import {LoginLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/server"
import { ArrowRight } from 'lucide-react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className='sticky inset-x-0 top-0 h-14 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <section className='flex items-center justify-between h-14 border-b border-zinc-200'>
          <Link
            href="/"
            className='flex z-40 font-semibold'
          >
            <p>DocIntellect</p>
          </Link>

          {/* Mobile Navigation */}

          <section className='hidden sm:flex items-center space-x-4'>
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: 'ghost',
                  size: "sm"
                })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm"
                })}
              >
                Signin
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get started
                <ArrowRight className='w-5 h-5 ml-1.5'/>
              </RegisterLink>
            </>
          </section>
        </section>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar