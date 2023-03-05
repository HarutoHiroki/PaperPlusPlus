package src.Backend;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.*;
import java.util.Scanner;

public class CompileCode {

    private String name; // name of the class to be compile

    public CompileCode(String name) {
        this.name = name;
    }

    private void start() {
        try {
            Class<?> c = Class.forName("src.Backend." + name);
            Method m = c.getDeclaredMethod("main", String[].class);
            m.invoke(null, (Object) new String[] {});
        } catch (Exception e) {
            System.out.println(false + "\n" + e.getCause());
        }
    }

    public static void main(String[] args) {
        String main = "";
        Scanner sc = null;
        try {
            sc = new Scanner("data/exported/task.txt");

            while (sc.hasNextLine()) {
                if (line.contains("*main")) {
                    main = line.replace(" *main", "");
                    break;
                }
            }
        } catch (Exception e) {
            System.out.println(false + "\n" + e.getCause());
        } finally {
            sc.close();
            main = main.trim();
        }
        
        CompileCode c = new CompileCode(main);
        c.start();
    }
}