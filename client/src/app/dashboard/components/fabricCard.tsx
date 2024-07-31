import Image from "next/image";

interface Fabric {
  id: number;
  name: string;
  imageId: number;
  description: string;
  length: number;
  lengthInMeters: boolean;
  width: number;
  widthInCentimeters: boolean;
}

interface FabricCardProps {
  fabric: Fabric;
}

const FabricCard: React.FC<FabricCardProps> = ({ fabric }) => {
  return (
    <div className="min-w-[200px] h-76 relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out box-border">
      <Image
        src={
          fabric.imageId != null
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${fabric.imageId}`
            : "/favicon.ico"
        }
        alt={fabric.name}
        width={500}
        height={500}
        className="object-cover w-full aspect-square"
      />
      <div className="p-4 bg-background">
        <h3 className="text-lg font-bold">{fabric.name}</h3>
        <p className="text-sm text-muted-foreground">{fabric.description}</p>
        <p className="text-sm text-muted-foreground">
          L: {fabric.length} {fabric.lengthInMeters ? "m" : "yd(s)"}
        </p>
        <p className="text-sm text-muted-foreground">
          W: {fabric.width} {fabric.widthInCentimeters ? "cm" : "in"}
        </p>
      </div>
    </div>
  );
};

export default FabricCard;
