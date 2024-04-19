import AuthForm from '@/components/AuthForm';
import insertRow from '@/supabase/models/insertRow';
import newServerClient from '@/supabase/utils/newServerClient';
import { PartialProfile } from '@/types/types';
import { redirect } from 'next/navigation';

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    'use server';

    const supabase = newServerClient();

    const { data, error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    if (data.user?.role === '') {
      return redirect(
        '/login?message=User already registered. Please try logging in instead.'
      );
    }

    if (error) {
      return redirect('/signup?message=Could not authenticate user.');
    }

    // Get userId and insert it as ID in Profiles table
    const userId = data && data.user?.id;
    insertRow('profiles', {
      id: userId,
      email: formData.get('email'),
      postcode: formData.get('postcode'),
      username: formData.get('user_name'),
      refugee: formData.get('refugee') === 'true',
    } as PartialProfile);

    return redirect('/login?message=Check email to continue sign in process');
  };

  return (
    <div className=' flex flex-col  items-center  px-8  '>
      <AuthForm
        onSubmit={signUp}
        buttonText='REGISTER'
        searchParams={searchParams}
        isSignUp={true}
      />
    </div>
  );
}
