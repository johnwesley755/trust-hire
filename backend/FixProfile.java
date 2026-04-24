import java.sql.*;
import java.util.UUID;

public class FixProfile {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/trusthire_monolith_db";
        String user = "trusthire_user";
        String password = "trusthire123";
        String userId = "758bd3be-af8f-4515-b13b-2952510fe04a";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            // Check if profile exists
            PreparedStatement check = conn.prepareStatement("SELECT id FROM employer_profiles WHERE user_id = ?");
            check.setString(1, userId);
            if (!check.executeQuery().next()) {
                // Insert profile
                PreparedStatement insert = conn.prepareStatement(
                    "INSERT INTO employer_profiles (id, user_id, company_name, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())"
                );
                insert.setObject(1, UUID.randomUUID());
                insert.setString(2, userId);
                insert.setString(3, "John's Company");
                insert.setBoolean(4, false);
                insert.executeUpdate();
                System.out.println("Profile created successfully for user: " + userId);
            } else {
                System.out.println("Profile already exists.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
