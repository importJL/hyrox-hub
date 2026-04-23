import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ClassSession } from '@/data/mockData';
import { toast } from 'sonner';

export type Booking = {
  classId: string;
  classSession: ClassSession;
  bookedAt: Date;
};

export type ReviewEntry = {
  id: string;
  targetId: string;
  targetType: 'class' | 'instructor' | 'location';
  rating: number;
  comment: string;
  date: string;
};

type BookingsContextType = {
  bookings: Booking[];
  reviews: ReviewEntry[];
  hasBookedClass: (classId: string, date?: string, time?: string) => boolean;
  hasAttendedClass: (classId: string, date: string, time: string) => boolean;
  isClassFullyBooked: (classSession: ClassSession) => boolean;
  hasSpotsAvailable: (classSession: ClassSession) => boolean;
  bookClass: (classSession: ClassSession) => boolean;
  unbookClass: (classId: string) => void;
  hasUserReviewed: (targetId: string, targetType: 'class' | 'instructor' | 'location') => boolean;
  canReviewClass: (classId: string) => boolean;
  submitReview: (targetId: string, targetType: 'class' | 'instructor' | 'location', rating: number, comment: string) => boolean;
};

const BookingsContext = createContext<BookingsContextType | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);

  const hasBookedClass = useCallback((classId: string, date?: string, time?: string): boolean => {
    return bookings.some(b => 
      b.classId === classId && 
      (!date || b.classSession.date === date) &&
      (!time || b.classSession.time === time)
    );
  }, [bookings]);

  const hasAttendedClass = useCallback((classId: string, date: string, time: string): boolean => {
    const classDateTime = new Date(`${date} ${time}`);
    return new Date() > classDateTime && hasBookedClass(classId, date, time);
  }, [hasBookedClass]);

  const isClassFullyBooked = useCallback((classSession: ClassSession): boolean => {
    return classSession.spotsBooked >= classSession.spotsTotal;
  }, []);

  const hasSpotsAvailable = useCallback((classSession: ClassSession): boolean => {
    return classSession.spotsBooked < classSession.spotsTotal;
  }, []);

  const bookClass = useCallback((classSession: ClassSession): boolean => {
    if (hasBookedClass(classSession.id, classSession.date, classSession.time)) {
      toast.error('You have already booked this class');
      return false;
    }
    
    if (isClassFullyBooked(classSession)) {
      toast.error('This class is fully booked');
      return false;
    }

    setBookings(prev => [...prev, {
      classId: classSession.id,
      classSession,
      bookedAt: new Date(),
    }]);
    
    toast.success(`Successfully booked ${classSession.title}!`);
    return true;
  }, [hasBookedClass, isClassFullyBooked]);

  const unbookClass = useCallback((classId: string): void => {
    setBookings(prev => prev.filter(b => b.classId !== classId));
    toast.success('Booking cancelled');
  }, []);

  const hasUserReviewed = useCallback((targetId: string, targetType: 'class' | 'instructor' | 'location'): boolean => {
    return reviews.some(r => r.targetId === targetId && r.targetType === targetType);
  }, [reviews]);

  const canReviewClass = useCallback((classId: string): boolean => {
    return hasBookedClass(classId);
  }, [hasBookedClass]);

  const submitReview = useCallback((
    targetId: string, 
    targetType: 'class' | 'instructor' | 'location', 
    rating: number, 
    comment: string
  ): boolean => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return false;
    }

    if (hasUserReviewed(targetId, targetType)) {
      toast.error('You have already reviewed this');
      return false;
    }

    setReviews(prev => [...prev, {
      id: Date.now().toString(),
      targetId,
      targetType,
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    }]);
    
    toast.success('Review submitted successfully!');
    return true;
  }, [hasUserReviewed]);

  const value: BookingsContextType = {
    bookings,
    reviews,
    hasBookedClass,
    hasAttendedClass,
    isClassFullyBooked,
    hasSpotsAvailable,
    bookClass,
    unbookClass,
    hasUserReviewed,
    canReviewClass,
    submitReview,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}