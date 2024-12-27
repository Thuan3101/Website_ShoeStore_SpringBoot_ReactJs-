package nhom3.ShoeStore.demo.model;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

@Embeddable
public class Ratings implements Serializable {
    
    private double average;
    private int reviews;

    public double getAverage() {
        return average;
    }

    public void setAverage(double average) {
        this.average = average;
    }

    public int getReviews() {
        return reviews;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }
}
