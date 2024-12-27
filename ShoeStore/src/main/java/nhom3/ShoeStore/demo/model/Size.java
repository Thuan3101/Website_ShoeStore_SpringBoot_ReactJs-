package nhom3.ShoeStore.demo.model;
import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "size")
public class Size implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;

    private String euSize;

    private String ukSize;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public String getEuSize() {
		return euSize;
	}

	public void setEuSize(String euSize) {
		this.euSize = euSize;
	}

	public String getUkSize() {
		return ukSize;
	}

	public void setUkSize(String ukSize) {
		this.ukSize = ukSize;
	}

    
}

