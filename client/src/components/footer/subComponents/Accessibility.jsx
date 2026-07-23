import React, { useEffect } from "react";

function Accessibility() {
  useEffect(() => {
    document.title = "Accessibility | Stand Out";
  }, []);

  return (
    <div className="footer__t-c">
      <h1>Our Commitment to Accessibility</h1>

      <p>
        stand out is committed to making our website content accessible and user
        friendly to everyone. If you are having difficulty viewing or navigating
        the content on this website, or notice any content, feature, or
        functionality that you believe is not fully accessible to people with
        disabilities, please call our Customer Service team at 1-111-111-1111,
        or email our team, include “Disabled Access” in the subject line, and
        provide a description of the specific feature you feel is not fully
        accessible or a suggestion for improvement. We take your feedback
        seriously and will consider it as we evaluate ways to accommodate all of
        our customers and our overall accessibility policies. Additionally,
        while we do not control such vendors, we strongly encourage vendors of
        third-party digital content to provide content that is accessible and
        user friendly.
      </p>
    </div>
  );
}

export default Accessibility;
