package  com.mouadh.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseUser {
    @Id
    protected String id;
    
    protected String name;
    
    @Indexed(unique = true)
    protected String email;
    
    protected String password;
    
    protected LocalDateTime createdAt;
}