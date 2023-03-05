
public class Main {

  public static void main(String[] args) {
    Dependent1 dep1 = new Dependent1();
    Dependent2 dep2 = new Dependent2();
    System.out.println("Hello world"+dep1.dep1()+dep2.dep2());
  }
}
