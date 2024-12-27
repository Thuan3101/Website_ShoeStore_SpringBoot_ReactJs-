package nhom3.ShoeStore.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import nhom3.ShoeStore.demo.model.User;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.xml.bind.DatatypeConverter;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpiration; // Add refresh token expiration

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().getName())
                .claim("phone", user.getPhone())
                .claim("address", user.getAddress())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, DatatypeConverter.parseBase64Binary(secret))
                .compact();
    }

    // New method to generate a refresh token
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().getName())
                .claim("phone", user.getPhone())
                .claim("address", user.getAddress())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(SignatureAlgorithm.HS512, DatatypeConverter.parseBase64Binary(secret))
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        return (getUsernameFromToken(token).equals(username) && !isTokenExpired(token));
    }

    public Boolean validateRefreshToken(String token) {
        return !isTokenExpired(token); // Refresh tokens are validated by checking expiration
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(secret)).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public Long getUserIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("id", Long.class));
    }

}
