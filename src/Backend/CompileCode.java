package src.Backend;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.*;

public class CompileCode {

    private boolean status; // status of the compilation
    private String name; // name of the class to be compiled

    public CompileCode(String name) {
        this.name = name;
    }

    public static void main(String[] args) {
        CompileCode c = new CompileCode("Test");
        c.start();
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
}
 