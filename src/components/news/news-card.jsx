import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { disLike, Like } from "@/api/news/actions";
import { getCategories } from "@/api/categories/categories";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function NewsCard({
  title,
  img,
  category_id,
  createdAt,
  view,       
  views,     
  viewCount, 
  like,
  dislike,
  to = "#",
  id,
}) {
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(like);
  const [dislikeCount, setDislikeCount] = useState(dislike);
  

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const categoryName = (() => {
    if (category_id && typeof category_id === 'object' && category_id.name) {
      return category_id.name;
    }
    if (category_id && categories) {
      const targetId = typeof category_id === 'object' ? (category_id._id || category_id.id) : category_id;
      
      const found = categories.find(c => String(c._id || c.id) === String(targetId));
      if (found) return found.name;
    }

    return "Kateqoriyasız";
  })();

  const finalViews = view ?? views ?? viewCount ?? 0;

  const likeMutation = useMutation({
    mutationKey: ["like", id],
    mutationFn: () => Like(id),
    onSuccess: () => {
      toast.success("Like əlavə edildi");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
  

  const disLikeMutation = useMutation({
    mutationKey: ["dislike", id],
    mutationFn: () => disLike(id),
    onSuccess: () => {
      toast.success("Dislike əlavə edildi");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });

  return (
    <Card className="overflow-hidden rounded-xl py-0 transition-all hover:shadow-lg">
      <div className="relative aspect-[16/10]">
        <img
          src={img || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000"}
          alt={title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute bottom-4 right-4 bg-pink-600 hover:bg-pink-600">
          FOTO
        </Badge>
      </div>

      <CardContent className="space-y-6 p-5">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{createdAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{finalViews}</span>
          </div>
        </div>

        <Link to={to}>
          <h3 className="line-clamp-3 min-h-[96px] text-2xl font-bold leading-relaxed">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="font-semibold uppercase tracking-wide text-cyan-600">
            {categoryName}
          </span>

          <div className="flex items-center gap-3">
            {likeMutation.isPending ? (
              <Spinner />
            ) : (
              <div
                onClick={() => {
                  if (isLiked) return;
                  if (isDisliked) {
                    setDislikeCount((prev) => prev - 1);
                    setIsDisliked(false);
                  }
                  likeMutation.mutate();
                  setIsLiked(true);
                  setLikeCount((prev) => prev + 1);
                }}
                className={`flex items-center gap-1 cursor-pointer transition-colors ${
                  isLiked ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
                }`}
              >
                <ThumbsUp className="h-5 w-5" style={isLiked ? { fill: "currentColor" } : {}} />
                <span>{likeCount}</span>
              </div>
            )}

            {disLikeMutation.isPending ? (
              <Spinner />
            ) : (
              <div
                onClick={() => {
                  if (isDisliked) return;
                  if (isLiked) {
                    setLikeCount((prev) => prev - 1);
                    setIsLiked(false);
                  }
                  disLikeMutation.mutate();
                  setIsDisliked(true);
                  setDislikeCount((prev) => prev + 1);
                }}
                className={`flex items-center gap-1 cursor-pointer transition-colors ${
                  isDisliked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <ThumbsDown className="h-5 w-5" style={isDisliked ? { fill: "currentColor" } : {}} />
                <span>{dislikeCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

  );
  
}