import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingService } from '../../../../services/rating.service';
import { Star, X, Loader2 } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  workerName: string;
  jobId: string;
}

export const RatingModal = ({ isOpen, onClose, workerId, workerName, jobId }: RatingModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { rateeId: string; jobId: string; score: number; comment: string }) =>
      ratingService.submitRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', workerId] });
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Rate {workerName}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star
                className={`h-10 w-10 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-white/60">Professional Feedback</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the worker's performance and punctuality?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
          />
        </div>

        <button
          onClick={() => mutation.mutate({ rateeId: workerId, jobId, score: rating, comment })}
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="animate-spin h-5 w-5" />}
          {mutation.isPending ? 'Submitting...' : 'Submit Professional Rating'}
        </button>
      </div>
    </div>
  );
};
