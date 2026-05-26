import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

type SignupPayload = {
  email: string;
  password: string;
};

type ErrorResponse = {
  error: string;
};

type SuccessResponse = {
  message: string;
  userId: string;
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body: SignupPayload = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('auth_login_signup_itrqt_users')
      .select('user_id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from('auth_login_signup_itrqt_users')
      .insert([
        {
          email: normalizedEmail,
          password_hash: passwordHash,
        },
      ])
      .select('user_id')
      .single();

    if (insertError || !newUser) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        userId: newUser.user_id,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
