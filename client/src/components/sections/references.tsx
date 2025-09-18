export default function References() {
  const references = [
    "Kaoğlu İnşaat",
    "Özkar İş Merkezi",
    "Melikgazi Belediyesi",
    "Kayseri Sitesi",
    "Modern Yaşam Kompleksi",
    "Kentsoy Residences"
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Referanslar</h2>
          <p className="text-xl text-muted-foreground">Siz de başarı hikayemizin bir parçası olun.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {references.map((reference, index) => (
            <div 
              key={index}
              className="bg-muted rounded-lg p-6 flex items-center justify-center h-20 hover:bg-muted/80 transition-colors"
              data-testid={`reference-${index}`}
            >
              <span className="text-muted-foreground font-medium text-center text-sm">
                {reference}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
