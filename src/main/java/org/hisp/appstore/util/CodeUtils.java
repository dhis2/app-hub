package org.hisp.appstore.util;

import java.util.Random;
import java.util.regex.Pattern;

public class CodeUtils
{
    public static final String letters = "abcdefghijklmnopqrstuvwxyz"
        + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static final String allowedChars = "0123456789" + letters;

    public static final int NUMBER_OF_CODEPOINTS = allowedChars.length();
    public static final int CODESIZE = 11;

    private static final Pattern CODE_PATTERN = Pattern.compile( "^[a-zA-Z]{1}[a-zA-Z0-9]{10}$" );

    private static final Pattern PASSWORD_PATTERN = Pattern.compile( "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{10,50}$" );

    /**
     * Generates a pseudo random string using the allowed characters. Code is
     * 11 characters long.
     *
     * @return the code.
     */
    public static String generateCode()
    {
        return generateCode( CODESIZE );
    }

    /**
     * Generates a pseudo random string using the allowed characters.
     *
     * @param codeSize the number of characters in the code.
     * @return the code.
     */
    public static String generateCode( int codeSize )
    {
        Random rand = new Random();

        char[] randomChars = new char[codeSize];

        randomChars[0] = letters.charAt( rand.nextInt( letters.length() ) );

        for ( int i = 1; i < codeSize; ++i )
        {
            randomChars[i] = allowedChars.charAt( rand.nextInt( NUMBER_OF_CODEPOINTS ) );
        }

        return new String( randomChars );
    }

    /**
     * Tests whether the given code is valid.
     *
     * @param code the code to validate.
     * @return true if the code is valid.
     */
    public static boolean isValidCode( String code )
    {
        return code != null && CODE_PATTERN.matcher( code ).matches();
    }

    /**
     * Tests whether the given password is valid.
     *
     * @param password the password.
     * @return true of the password is valid.
     */
    public static boolean isValidPassword( String password )
    {
        return password != null && PASSWORD_PATTERN.matcher( password ).matches();
    }

    /**
     * Returns the beginning of the string. If the string length is greater than
     * the given max, a string of length max ending with ".." is returned,
     * otherwise the string is returned unmodified.
     *
     * @param str the string.
     * @param max the max-length.
     * @return a string.
     */
    public static String getPrettySubstring( String str, int max )
    {
        if ( str == null || str.length() <= max )
        {
            return str;
        }
        else
        {
            return str.substring( 0, ( max - 2 ) ) + "..";
        }
    }
}