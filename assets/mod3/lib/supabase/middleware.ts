function forceLoginWithReturn(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

///

const { data: { user } } = await supabase.auth.getUser()

const protectedRoutes = ['/account'];

if (!user && protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
  return forceLoginWithReturn(request);
}
