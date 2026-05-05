package com.fooddonation.repository;

import com.fooddonation.entity.Donation;
import com.fooddonation.entity.DonationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    
    List<Donation> findByDonorIdOrderByCreatedAtDesc(Long donorId);
    
    List<Donation> findByStatus(DonationStatus status);

    // Pessimistic lock for claiming
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM Donation d WHERE d.id = :id")
    Optional<Donation> findByIdWithPessimisticLock(@Param("id") Long id);

    // For geo-fencing (basic bounding box or Haversine in code, but JPA we'll just fetch PENDING and filter in service or use Haversine query)
    // Haversine formula query to find nearby donations
    @Query(value = "SELECT * FROM donations d WHERE d.status = 'PENDING' AND " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(d.latitude)) * " +
           "cos(radians(d.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(d.latitude)))) <= :radius", nativeQuery = true)
    List<Donation> findNearbyPendingDonations(@Param("latitude") Double latitude, 
                                              @Param("longitude") Double longitude, 
                                              @Param("radius") Double radius);
}
