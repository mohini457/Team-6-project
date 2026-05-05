package com.fooddonation.dto;

import java.time.LocalDateTime;

public class DonationRequest {
    private String foodType;
    private Integer quantity;
    private LocalDateTime bestBefore;
    private String imageUrl;
    private Double latitude;
    private Double longitude;

    public String getFoodType() { return foodType; }
    public void setFoodType(String foodType) { this.foodType = foodType; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public LocalDateTime getBestBefore() { return bestBefore; }
    public void setBestBefore(LocalDateTime bestBefore) { this.bestBefore = bestBefore; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
