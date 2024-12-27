package nhom3.ShoeStore.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfiguration {
    @Bean
    public OpenAPI defineOpenApi() {
        // Server Configuration
        Server server = new Server();
        server.setUrl("http://localhost:8088");
        server.setDescription("Shoe Store Management API Documentation");

        // API Info
        Info information = new Info()
                .title("Shoe Store API Documentation")
                .version("1.0")
                .description("This API exposes endpoints to manage shoes, categories, and more.");

        // Security Scheme for JWT Bearer Token
        SecurityScheme securityScheme = new SecurityScheme()
                .name("Bearer Authentication")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        // Security Requirement
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("Bearer Authentication");

        // Build OpenAPI object
        return new OpenAPI()
                .info(information)
                .servers(List.of(server))
                .addSecurityItem(securityRequirement)
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", securityScheme));
    }
}
