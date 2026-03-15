import java.sql.*;

public class DbCheck {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/trusthire_auth_db";
        String user = "trusthire_user";
        String password = "trusthire123";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            String sql = "SELECT email FROM user_metadata WHERE email = 'johnwesley8113@gmail.com'";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                if (rs.next()) {
                    System.out.println("USER_EXISTS: " + rs.getString("email"));
                } else {
                    System.out.println("USER_NOT_FOUND");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
