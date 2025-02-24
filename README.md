# 개인정보처리방침 (Privacy Policy)

**최종 수정일**: 2025년 2월 20일

**“엔트리-projek”**(이하 “본 확장 프로그램”)은 사용자의 개인정보를 중요시하며, 「개인정보 보호법」 및 관련 법령을 준수하고 있습니다. 본 확장 프로그램은 개인정보를 어떠한 방식으로 취급·관리하는지 명시하기 위해 다음과 같은 개인정보처리방침을 수립·공개합니다.

---

## 1. 개인정보의 처리 목적
본 확장 프로그램은 [https://playentry.org/](https://playentry.org/) 사이트에서 제공되는 작품(프로젝트) 정보를 조회하여, 사용자에게 인기 작품 랭킹과 같은 정보를 화면에 표시하는 것을 목적으로 합니다. 이를 위해 다음과 같은 정보에 접근할 수 있습니다.

- **GraphQL API 호출을 위한 인증 토큰**: 사이트 메타 태그에서 가져오는 CSRF 토큰, X-Token  
  - 해당 토큰은 사용자가 로그인한 상태에서만 유효하며, 프로젝트 정보 조회를 위해서만 사용됩니다.

본 확장 프로그램은 위 목적 외에 다른 용도로 개인정보를 이용하거나 제3자에게 제공하지 않습니다.

---

## 2. 처리하는 개인정보 항목 및 수집 방법
본 확장 프로그램은 별도의 회원 가입 절차 없이, **브라우저가 제공하는 메타 태그** 정보를 이용하여 다음 항목을 임시적으로 수집·이용합니다.

1. **자동으로 수집되는 항목**  
   - CSRF 토큰, X-Token (플레이엔트리 사이트 메타 태그를 통해 가져옴)  
   - API 응답에 포함되는 프로젝트 정보(프로젝트 ID, 제목, 작성자 닉네임·프로필 이미지 등)

2. **수집 방법**  
   - 사용자가 [https://playentry.org/](https://playentry.org/) 접속 시, 해당 페이지 내에 존재하는 메타 태그 및 GraphQL API 응답을 통해 자동으로 가져옴

---

## 3. 개인정보의 보유 및 이용 기간
- 본 확장 프로그램은 **토큰 및 프로젝트 정보**를 **브라우저 메모리(전역 변수)**에만 임시적으로 저장하며, **서버나 외부 저장소로 전송·보관하지 않습니다.**  
- 사용자가 페이지를 새로고침하거나 브라우저를 종료하면, 임시 저장된 정보는 자동으로 삭제됩니다.  
- 따라서 본 확장 프로그램은 별도의 보유 기간 없이, 사용자의 **실시간 요청에 한해서만** 정보를 표시합니다.

---

## 4. 개인정보의 제3자 제공 및 처리 위탁
- 본 확장 프로그램은 이용자의 개인정보를 외부 서버로 전송하거나 제3자에게 제공·위탁하지 않습니다.  
- 단, [https://playentry.org/](https://playentry.org/) 사이트의 GraphQL API를 이용할 때, 해당 사이트(플레이엔트리) 서버와 통신이 이루어집니다. 이는 본 확장 프로그램의 필수 기능(프로젝트 정보 조회)이며, 확장 프로그램이 추가적으로 정보를 가공·전달하지 않습니다.

---

## 5. 쿠키(Cookie)의 사용
- 본 확장 프로그램은 자체적으로 쿠키를 생성하거나 저장하지 않습니다.  
- 다만 [https://playentry.org/](https://playentry.org/) 사이트에서 설정한 쿠키가 있을 수 있으며, 이는 플레이엔트리 사이트 정책에 따릅니다.

---

## 6. 개인정보 보호를 위한 기술적·관리적 대책
- 본 확장 프로그램은 최소한의 권한만을 사용합니다. (“host_permissions”: `https://playentry.org/*`)  
- 어떠한 민감정보(금융정보, 고유식별정보 등)도 수집·저장·전송하지 않습니다.  
- 사용자의 정보를 외부 서버에 전송하지 않으므로, 데이터 유출 가능성을 최소화합니다.

---

## 7. 이용자 및 법정대리인의 권리와 행사 방법
- 본 확장 프로그램은 사용자로부터 직접 개인정보를 수집·저장하지 않으므로, 별도의 정정·삭제·처리정지 요구 절차가 필요하지 않습니다.  
- 플레이엔트리(https://playentry.org) 계정 정보에 대한 문의·수정·삭제는 플레이엔트리 측의 정책 및 고객센터를 통해 진행하셔야 합니다.

---

## 8. 아동의 개인정보 보호
- 본 확장 프로그램은 아동을 포함한 모든 사용자를 대상으로 별도의 회원 가입이나 개인정보 입력을 요구하지 않습니다.  
- 아동의 개인정보를 별도로 인지하여 수집·저장·이용하지 않습니다.

---

## 9. 개인정보 보호책임자 및 문의처
본 확장 프로그램과 관련하여 문의사항이 있으신 경우, 연락해 주시기 바랍니다.

---

## 10. 개인정보처리방침의 변경
- 본 개인정보처리방침은 2025년 2월 20일부터 적용됩니다.  
- 법령, 정책 또는 보안기술의 변경에 따라 내용이 추가·삭제·수정될 수 있으며, 변경 시에는 본 문서를 통해 즉시 안내합니다.
