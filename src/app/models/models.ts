export type Role = 'ADMIN' | 'USER';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LoginResponse {
  token: string;
  role: Role;
  id: number;
  displayName: string;
}

export interface Category { id: number; name: string; }
export interface Platform { id: number; name: string; }

export interface GameSummary {
  id: number;
  title: string;
  publisher: string;
  releaseYear: number;
  esrbRating: string;
  forSale: boolean;
  price: number | null;
  categoryId: number;
  categoryName: string;
  averageRating: number | null;
  hasImage: boolean;
}

export interface GameDetail extends GameSummary {
  description: string;
  platforms: Platform[];
  esrbFacts: string[];
}

export interface GameRequest {
  title: string;
  publisher: string;
  releaseYear: number;
  description: string;
  esrbRating: string;
  forSale: boolean;
  price: number | null;
  categoryId: number;
  platformIds: number[];
  esrbFacts: string[];
}

export interface PublicReview {
  id: number;
  rating: number;
  comment: string | null;
  rejectionReason: string | null;
  status: ReviewStatus;
  userFullName: string;
  userCity: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReview {
  id: number;
  gameId: number;
  gameTitle: string;
  userId: number;
  userFullName: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}
