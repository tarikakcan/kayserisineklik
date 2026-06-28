import { legalMeta } from './legal-config.js'

export const kullanimKosullari = {
  slug: 'kullanim-kosullari',
  title: 'Kullanım Koşulları',
  subtitle: 'Web Sitesi Kullanım Şartları ve Koşulları',
  updated: legalMeta.lastUpdated,
  lead: 'Bu kullanım koşulları, kayserisineklik.com.tr internet sitesini ziyaret eden tüm kullanıcılar için geçerlidir. Siteyi kullanmaya başlayan herkes, aşağıda belirtilen koşulları kabul etmiş sayılır.',
  notice: null,
  sections: [
    {
      num: '01',
      title: 'Giriş',
      paragraphs: [
        'Bu kullanım koşulları, kayserisineklik.com.tr internet sitesini ziyaret eden tüm kullanıcılar için geçerlidir.',
        'Siteyi kullanmaya başlayan herkes, aşağıda belirtilen koşulları kabul etmiş sayılır. Bu koşulları kabul etmiyorsanız, lütfen siteyi kullanmayınız.',
        'Bu kullanım koşulları, sitenin kullanımına ilişkin hak ve yükümlülüklerinizi belirler. Lütfen dikkatlice okuyunuz.',
      ],
    },
    {
      num: '02',
      title: 'Hizmetin Kapsamı',
      paragraphs: [
        `${legalMeta.companyLegal}, sineklik ürün ve hizmetlerine ilişkin tanıtım, bilgilendirme ve iletişim amacıyla bu siteyi işletmektedir.`,
      ],
      purposes: [
        { title: 'Bilgilendirme Amaçlı', text: 'Site içeriği bilgilendirme amaçlıdır ve bağlayıcı taahhüt niteliği taşımaz' },
        { title: 'Ürün Kataloğu', text: 'Ürün bilgileri, görseller ve teknik özellikler tanıtım amaçlıdır' },
        { title: 'İletişim Platformu', text: 'Müşterilerle iletişim kurmak ve teklif taleplerini almak için kullanılır' },
      ],
      important: 'Sitede yer alan bilgiler, resmi teklif veya sözleşme niteliği taşımaz. Kesin fiyat ve koşullar için lütfen bizimle iletişime geçiniz.',
    },
    {
      num: '03',
      title: 'Kullanıcı Yükümlülükleri',
      paragraphs: [
        'Siteyi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:',
      ],
      purposes: [
        { title: 'Hukuka Aykırı Kullanım Yasaktır', text: 'Siteyi yasalara aykırı veya kötüye kullanım amacıyla kullanamazsınız' },
        { title: 'Hak İhlali Yasaktır', text: 'Başkalarının haklarını ihlal edecek içerik paylaşamazsınız' },
        { title: 'Güvenlik İhlali Yasaktır', text: 'Site güvenliğini tehlikeye atacak girişimlerde bulunamazsınız' },
        { title: 'Spam ve Kötüye Kullanım Yasaktır', text: 'Spam, virüs veya zararlı yazılım içeren içerik paylaşamazsınız' },
      ],
    },
    {
      num: '04',
      title: 'Formların Kullanım Amacı',
      paragraphs: [
        `${legalMeta.companyLegal} internet sitesinde yer alan iletişim ve teklif talebi formları yalnızca müşteri taleplerinin alınması, teklif/sipariş süreçlerinin yürütülmesi ve müşteriyle iletişim kurulması amacıyla kullanılabilir.`,
      ],
      listIntro: 'Bu formlar aşağıdaki amaçlar için kesinlikle kullanılamaz:',
      listItems: [
        'Reklam, tanıtım, pazarlama içerikleri',
        'Kötü niyetli, yanıltıcı veya gerçeğe aykırı bilgiler',
        'Hack girişimleri, zararlı yazılım veya sistem güvenliğini tehdit eden içerikler',
        'Şirket faaliyetleriyle ilgisi bulunmayan diğer amaçlar',
      ],
      important: 'Bu tür kullanımlar tespit edildiğinde, ilgili kişi veya kurum hakkında yasal işlem başlatılabilir. Türk Ceza Kanunu ve ilgili mevzuat hükümleri uygulanır.',
    },
    {
      num: '05',
      title: 'Fikri Mülkiyet Hakları',
      paragraphs: [
        `Sitede yer alan tüm içerikler (metin, görsel, logo, marka, tasarım, yazılım vb.) ${legalMeta.companyLegal}'ye aittir ve fikri mülkiyet hakları ile korunmaktadır.`,
      ],
      purposes: [
        { title: 'Telif Hakları', text: 'Tüm içerikler telif hakkı ile korunmaktadır' },
        { title: 'Marka Hakları', text: 'Logo ve marka tescilli markadır' },
        { title: 'Görsel Hakları', text: 'Ürün görselleri ve fotoğraflar korunmaktadır' },
      ],
      listIntro: 'Yasak Kullanımlar',
      listItems: [
        'İzinsiz kopyalama, çoğaltma veya dağıtma',
        'Ticari amaçla kullanma',
        'Değiştirme veya türev eser oluşturma',
        'Başka sitelerde yayınlama',
      ],
    },
    {
      num: '06',
      title: 'Sorumluluk Sınırlamaları',
      paragraphs: [
        `${legalMeta.companyLegal}, site üzerinden verilen bilgilerin güncelliği ve doğruluğu konusunda azami özen gösterse de, aşağıdaki durumlardan sorumlu tutulamaz:`,
        'Site "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız çalışacağına dair garanti verilmemektedir.',
      ],
      rights: [
        { title: 'Teknik Hatalar', text: 'Sunucu arızaları, bağlantı sorunları veya teknik aksaklıklar' },
        { title: 'Kesintiler', text: 'Bakım, güncelleme veya beklenmeyen durumlardan kaynaklanan kesintiler' },
        { title: 'Bilgi Güncelliği', text: 'Ürün bilgilerinde oluşabilecek gecikmeler veya değişiklikler' },
        { title: 'Üçüncü Taraf Bağlantılar', text: 'Dış linklerin içeriği ve güvenliği' },
        { title: 'Kullanıcı Hataları', text: 'Yanlış bilgi girişi veya kullanıcı kaynaklı sorunlar' },
      ],
    },
    {
      num: '07',
      title: 'Veri Toplama ve Gizlilik',
      paragraphs: [
        'Sitemizde iletişim formu ve teklif talebi formu bulunmaktadır. Kullanıcı bu formları doldururken gizlilik politikasını kabul etmiş sayılır.',
        'Formlar doldurulduğunda bilgiler doğrudan şirketimizin info@edekakapi.com e-posta adresine iletilir. Toplanan bilgiler (ad soyad, telefon, e-posta, müşteri notu ve teklif/ürün bilgileri) yalnızca müşteriyle iletişime geçmek ve teklif/sipariş sürecini yürütmek amacıyla kullanılır.',
      ],
      subsections: [
        {
          title: 'Veri Saklama Süresi',
          text: 'Veriler, müşteri silmemizi isteyinceye kadar saklanır. Müşteri talep ettiğinde veriler derhal silinir. Yasal yükümlülükler (örneğin fatura kayıtları) için mevzuatta öngörülen süreler ayrıca geçerlidir.',
        },
        {
          title: 'Yurt Dışına Veri Aktarımı',
          text: 'Kullanıcı formlarından gelen bilgiler, şirketimizin e-posta altyapısı (Hostinger SMTP / info@edekakapi.com) üzerinden işlenmektedir. E-posta hizmeti sağlayıcısının sunucularının yurt dışında bulunması ihtimali nedeniyle verilerin yurt dışına aktarımı söz konusu olabilir.',
        },
      ],
      listIntro: 'Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için:',
      relatedLegal: [
        { slug: 'gizlilik-politikasi', title: 'Gizlilik Politikası', text: 'Kişisel verilerinizin nasıl korunduğunu öğrenin' },
        { slug: 'kvkk-aydinlatma-metni', title: 'KVKK Aydınlatma Metni', text: 'Kişisel veri işleme detaylarını inceleyin' },
      ],
    },
    {
      num: '08',
      title: 'Çerezler (Cookies)',
      paragraphs: [
        'Web sitemizde herhangi bir amaçla çerez toplanmamaktadır. Kullanıcıların kişisel verileri çerezler aracılığıyla işlenmez.',
        'İleride çerez kullanımı söz konusu olursa, kullanıcıya çerez yönetim paneli sunulacak ve tercihlerine göre kişiselleştirme imkânı sağlanacaktır.',
      ],
    },
    {
      num: '09',
      title: 'Değişiklikler',
      paragraphs: [
        `${legalMeta.companyLegal}, bu kullanım koşullarını dilediği zaman güncelleme hakkını saklı tutar.`,
        'Güncelleme sonrası siteyi kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.',
      ],
      purposes: [
        { title: 'Güncelleme Hakkı', text: 'Koşullar önceden haber verilmeksizin güncellenebilir' },
        { title: 'Yürürlük', text: 'Güncellenen koşullar yayımlandığı anda geçerli olur' },
        { title: 'Takip Sorumluluğu', text: 'Kullanıcılar koşulları düzenli olarak kontrol etmelidir' },
      ],
    },
    {
      num: '10',
      title: 'Uyuşmazlık Çözümü',
      paragraphs: [
        'Bu kullanım koşullarından doğabilecek uyuşmazlıkların çözümünde aşağıdaki hükümler geçerlidir:',
      ],
      highlights: [
        { label: 'Uygulanacak Hukuk', text: 'Türk Hukuku uygulanır' },
        { label: 'Yetkili Mahkeme', text: 'Kayseri Mahkemeleri ve İcra Daireleri yetkilidir' },
      ],
    },
    {
      num: '11',
      title: 'İletişim',
      paragraphs: [
        'Her türlü soru ve talepleriniz için bizimle iletişime geçebilirsiniz:',
      ],
      contactMethods: true,
      footnote: 'Bu kullanım koşulları, yasal düzenlemelerdeki değişiklikler doğrultusunda güncellenebilir.',
    },
  ],
}
