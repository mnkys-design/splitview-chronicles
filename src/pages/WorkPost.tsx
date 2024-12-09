import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetchWorkPost = async (id: string) => {
  const { data: post, error: postError } = await supabase
    .from('work_posts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (postError) throw postError;

  const { data: images, error: imagesError } = await supabase
    .from('work_images')
    .select('*')
    .eq('work_post_id', id)
    .order('display_order', { ascending: true });
  
  if (imagesError) throw imagesError;

  return { post, images };
};

const WorkPost = () => {
  const { id } = useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ['workPost', id],
    queryFn: () => fetchWorkPost(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="brutalist-container py-12">
          <div className="h-12 w-1/3 bg-muted mb-8"></div>
          <div className="aspect-video mb-8 bg-muted"></div>
          <div className="h-24 bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="brutalist-container py-12">
          <h1 className="brutalist-heading mb-8">Work post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <div className="mb-8">
            <h1 className="brutalist-heading mb-4">{data.post.title}</h1>
            <time className="text-sm text-muted-foreground">
              {new Date(data.post.created_at).toLocaleDateString()}
            </time>
          </div>

          {/* Main Image */}
          {data.post.main_image_url && (
            <div className="aspect-video mb-8 overflow-hidden">
              <img 
                src={data.post.main_image_url} 
                alt={data.post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {data.post.description && (
            <p className="brutalist-text text-muted-foreground mb-12">
              {data.post.description}
            </p>
          )}

          {/* Image Gallery */}
          {data.images && data.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.images.map((image) => (
                <figure key={image.id} className="space-y-2">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img 
                      src={image.image_url} 
                      alt={image.caption || data.post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="text-sm text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkPost;