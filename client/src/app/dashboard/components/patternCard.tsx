import Image from "next/image";

interface Pattern {
  id: number;
  name: string;
  imageId: number;
  description: string;
  patternType: string;
  sizeRange: string;
}

interface PatternCardProps {
  pattern: Pattern;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  return (
    <div className="relaitve z-[1000] hover:shadow-xl hover:-translate-y-2 min-w-[200px] h-76 relative overflow-hidden rounded-lg shadow-lg group  transition-transform duration-300 ease-in-out box-border">
      <img
        src={
          pattern.imageId != null
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}`
            : "/favicon.ico"
        }
        alt={pattern.name}
        width={500}
        height={500}
        className="object-cover w-[200px] aspect-square z-[1000]"
      />
      <div className="p-4 bg-background">
        <h3 className="text-lg font-bold">{pattern.name}</h3>
        <p className="text-sm text-muted-foreground">{pattern.description}</p>
        <p className="text-sm text-muted-foreground">
          Type: {pattern.patternType}
        </p>
        <p className="text-sm text-muted-foreground">
          Size: {pattern.sizeRange}
        </p>
      </div>
    </div>
  );
};

export default PatternCard;
